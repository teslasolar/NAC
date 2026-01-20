/**
 * Embedding Generator for Legal Code Blocks
 *
 * Generates vector embeddings for legal code sections.
 * Uses multiple strategies:
 * - TF-IDF based (lightweight, local)
 * - Semantic hashing (deterministic)
 * - 3D projection for visualization
 */

const crypto = require('crypto');

class EmbeddingGenerator {
  constructor(options = {}) {
    this.dimensions = options.dimensions || 384;
    this.vocab = new Map();
    this.idf = new Map();
    this.docCount = 0;

    // Legal domain keywords with weights
    this.legalTerms = {
      // Controller powers
      'audit': 2.0, 'controller': 2.0, 'fiscal': 1.8, 'accounts': 1.5,
      'settlement': 1.5, 'supervision': 1.5, 'examination': 1.3,

      // Financial
      'budget': 1.8, 'appropriation': 1.5, 'expenditure': 1.5, 'revenue': 1.5,
      'tax': 1.5, 'fund': 1.3, 'payment': 1.3, 'claim': 1.5,

      // Officers
      'treasurer': 1.5, 'sheriff': 1.5, 'prothonotary': 1.5, 'coroner': 1.5,
      'recorder': 1.5, 'register': 1.5, 'clerk': 1.5, 'commissioner': 1.5,

      // Legal
      'shall': 1.2, 'duty': 1.3, 'authority': 1.3, 'power': 1.3,
      'statute': 1.5, 'ordinance': 1.3, 'resolution': 1.3,

      // Compliance
      'compliance': 1.5, 'violation': 1.5, 'penalty': 1.3, 'requirement': 1.3,
    };
  }

  // Tokenize text
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  // Build vocabulary from corpus
  buildVocab(documents) {
    const docFreq = new Map();
    this.docCount = documents.length;

    documents.forEach(doc => {
      const tokens = new Set(this.tokenize(doc));
      tokens.forEach(token => {
        this.vocab.set(token, (this.vocab.get(token) || 0) + 1);
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    // Calculate IDF
    docFreq.forEach((freq, token) => {
      this.idf.set(token, Math.log(this.docCount / (1 + freq)));
    });
  }

  // Generate TF-IDF embedding
  generateTFIDF(text) {
    const tokens = this.tokenize(text);
    const tf = new Map();
    const totalTokens = tokens.length;

    tokens.forEach(token => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });

    // Create sparse vector, then project to fixed dimensions
    const vector = new Array(this.dimensions).fill(0);

    tf.forEach((count, token) => {
      const termFreq = count / totalTokens;
      const idf = this.idf.get(token) || Math.log(this.docCount);
      const tfidf = termFreq * idf;

      // Apply legal term boost
      const boost = this.legalTerms[token] || 1.0;
      const score = tfidf * boost;

      // Hash token to dimension index
      const idx = this.hashToIndex(token);
      vector[idx] += score;
    });

    // Normalize
    return this.normalize(vector);
  }

  // Semantic hash embedding (deterministic, no training needed)
  generateSemanticHash(text) {
    const tokens = this.tokenize(text);
    const vector = new Array(this.dimensions).fill(0);

    tokens.forEach((token, position) => {
      // Generate multiple hash indices per token
      for (let i = 0; i < 3; i++) {
        const idx = this.hashToIndex(`${token}_${i}`);
        const sign = this.hashToSign(`${token}_${i}_sign`);
        const boost = this.legalTerms[token] || 1.0;
        const posWeight = 1 / (1 + Math.log(position + 1)); // Earlier tokens weighted more

        vector[idx] += sign * boost * posWeight;
      }
    });

    return this.normalize(vector);
  }

  // Generate 3D coordinates for visualization
  generate3D(text, article = null, section = null) {
    // X: semantic hash of content (topic space)
    const contentHash = this.hashToFloat(text);

    // Y: article/hierarchy position
    const articleNum = article ? parseInt(article.replace(/\D/g, '')) || 0 : 0;
    const sectionNum = section ? parseInt(section.replace(/\D/g, '')) || 0 : 0;
    const hierarchyPos = (articleNum * 100 + sectionNum) / 2500; // Normalize

    // Z: legal domain clustering
    const tokens = this.tokenize(text);
    let domainScore = 0;
    let totalWeight = 0;

    Object.entries(this.legalTerms).forEach(([term, weight]) => {
      if (tokens.includes(term)) {
        domainScore += weight;
      }
      totalWeight += weight;
    });

    const domainZ = domainScore / totalWeight;

    return {
      x: (contentHash - 0.5) * 10, // Center around 0, spread to [-5, 5]
      y: hierarchyPos * 10,         // Hierarchy from 0 to 10
      z: domainZ * 10,              // Domain relevance 0 to 10
    };
  }

  // Hash string to dimension index
  hashToIndex(str) {
    const hash = crypto.createHash('md5').update(str).digest();
    return hash.readUInt32LE(0) % this.dimensions;
  }

  // Hash string to +1 or -1
  hashToSign(str) {
    const hash = crypto.createHash('md5').update(str).digest();
    return (hash[0] % 2 === 0) ? 1 : -1;
  }

  // Hash string to float [0, 1]
  hashToFloat(str) {
    const hash = crypto.createHash('sha256').update(str).digest();
    return hash.readUInt32LE(0) / 0xFFFFFFFF;
  }

  // Normalize vector to unit length
  normalize(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (magnitude === 0) return vector;
    return vector.map(v => v / magnitude);
  }

  // Cosine similarity between two vectors
  cosineSimilarity(v1, v2) {
    let dot = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }

    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  // Euclidean distance between two vectors
  euclideanDistance(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i++) {
      const diff = v1[i] - v2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  // Generate full embedding package for a legal code block
  generateBlockEmbedding(block) {
    const fullText = `${block.statute} ${block.title || ''} ${block.content}`;

    return {
      semantic: this.generateSemanticHash(fullText),
      tfidf: this.vocab.size > 0 ? this.generateTFIDF(fullText) : null,
      coords3D: this.generate3D(fullText, block.article, block.section),
    };
  }
}

module.exports = { EmbeddingGenerator };
