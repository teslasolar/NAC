#!/usr/bin/env python3
"""Generate high-resolution PackML state SVG files for CV tracking."""

import os

STATES = {
    'STOPPED': {'color': '#6c757d', 'shape': 'square'},
    'IDLE': {'color': '#17a2b8', 'shape': 'circle'},
    'STARTING': {'color': '#ffc107', 'shape': 'triangle'},
    'EXECUTE': {'color': '#28a745', 'shape': 'play'},
    'COMPLETING': {'color': '#20c997', 'shape': 'check'},
    'COMPLETE': {'color': '#007bff', 'shape': 'check-circle'},
    'HELD': {'color': '#e83e8c', 'shape': 'pause'},
    'SUSPENDED': {'color': '#6f42c1', 'shape': 'pause-slash'},
    'STOPPING': {'color': '#dc3545', 'shape': 'stop'},
    'ABORTING': {'color': '#dc3545', 'shape': 'x'},
    'ABORTED': {'color': '#343a40', 'shape': 'x'},
    'RESETTING': {'color': '#ffc107', 'shape': 'refresh'},
    'CLEARING': {'color': '#6c757d', 'shape': 'warning'},
}

def generate_svg(state, props, size=200):
    color = props['color']
    shape = props['shape']
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 200 200">
  <!-- Background -->
  <rect x="10" y="10" width="180" height="180" rx="16" fill="{color}"/>
  
  <!-- State indicator shape -->
  {get_shape_svg(shape)}
  
  <!-- State label -->
  <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">{state}</text>
  
  <!-- Machine-readable marker corners -->
  <rect x="10" y="10" width="30" height="30" fill="white"/>
  <rect x="15" y="15" width="20" height="20" fill="black"/>
  <rect x="18" y="18" width="14" height="14" fill="white"/>
  
  <rect x="160" y="10" width="30" height="30" fill="white"/>
  <rect x="165" y="15" width="20" height="20" fill="black"/>
  <rect x="168" y="18" width="14" height="14" fill="white"/>
  
  <rect x="10" y="160" width="30" height="30" fill="white"/>
  <rect x="15" y="165" width="20" height="20" fill="black"/>
  <rect x="18" y="168" width="14" height="14" fill="white"/>
  
  <!-- State code (for CV) -->
  <rect x="160" y="160" width="30" height="30" fill="{get_code_pattern(state)}"/>
</svg>'''
    return svg

def get_shape_svg(shape):
    shapes = {
        'square': '<rect x="60" y="60" width="80" height="80" fill="white"/>',
        'circle': '<circle cx="100" cy="100" r="45" fill="none" stroke="white" stroke-width="8"/><circle cx="100" cy="100" r="15" fill="white"/>',
        'triangle': '<polygon points="100,55 145,130 55,130" fill="white"/>',
        'play': '<polygon points="70,55 70,145 150,100" fill="white"/>',
        'check': '<polyline points="55,100 85,130 150,65" fill="none" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
        'check-circle': '<circle cx="100" cy="100" r="50" fill="none" stroke="white" stroke-width="6"/><polyline points="70,100 90,120 135,75" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>',
        'pause': '<rect x="60" y="60" width="25" height="80" fill="white"/><rect x="115" y="60" width="25" height="80" fill="white"/>',
        'pause-slash': '<rect x="60" y="60" width="25" height="80" fill="white"/><rect x="115" y="60" width="25" height="80" fill="white"/><line x1="45" y1="45" x2="155" y2="155" stroke="white" stroke-width="8"/>',
        'stop': '<rect x="65" y="65" width="70" height="70" fill="white"/>',
        'x': '<line x1="60" y1="60" x2="140" y2="140" stroke="white" stroke-width="12" stroke-linecap="round"/><line x1="140" y1="60" x2="60" y2="140" stroke="white" stroke-width="12" stroke-linecap="round"/>',
        'refresh': '<path d="M100 55 A45 45 0 1 1 55 100" fill="none" stroke="white" stroke-width="8"/><polygon points="55,80 55,115 80,100" fill="white"/>',
        'warning': '<polygon points="100,55 145,140 55,140" fill="none" stroke="white" stroke-width="6"/><line x1="100" y1="80" x2="100" y2="110" stroke="white" stroke-width="6"/><circle cx="100" cy="125" r="4" fill="white"/>',
    }
    return shapes.get(shape, shapes['square'])

def get_code_pattern(state):
    # Simple color coding for CV detection
    codes = {
        'STOPPED': '#888888',
        'IDLE': '#00ffff',
        'STARTING': '#ffff00',
        'EXECUTE': '#00ff00',
        'COMPLETING': '#00ffaa',
        'COMPLETE': '#0088ff',
        'HELD': '#ff00ff',
        'SUSPENDED': '#8800ff',
        'STOPPING': '#ff0000',
        'ABORTING': '#ff4400',
        'ABORTED': '#440000',
        'RESETTING': '#ffaa00',
        'CLEARING': '#aaaaaa',
    }
    return codes.get(state, '#ffffff')

# Generate files
output_dir = os.path.dirname(os.path.abspath(__file__))
for state, props in STATES.items():
    svg = generate_svg(state, props)
    filename = f"{state.lower()}.svg"
    with open(os.path.join(output_dir, filename), 'w') as f:
        f.write(svg)
    print(f"Generated: {filename}")

print(f"\nGenerated {len(STATES)} PackML state SVGs")
