/**
 * Tags Module - UDT Templates and Tag Instances
 *
 * Provides separation of:
 * - UDT Templates (type definitions / schemas)
 * - Tag Instances (runtime values)
 * - TagBrowser (unified access interface)
 *
 * Directory Structure:
 * tags/
 * ├── udt/                    # UDT Templates (type definitions)
 * │   ├── base/               # Base types (Station, Line, Unit, WorkItem, Alarm)
 * │   └── officers/           # Officer-specific composite UDTs
 * │
 * └── instances/              # Tag Instances (runtime values)
 *     ├── sheriff/
 *     ├── treasurer/
 *     ├── coroner/
 *     ├── district-attorney/
 *     ├── recorder-of-deeds/
 *     ├── register-of-wills/
 *     ├── clerk-of-courts/
 *     ├── prothonotary/
 *     └── enterprise/
 *
 * @module digitaltwin/tags
 */

export {
  TagBrowser,
  TagNode,
  TagValue,
  TagDataType,
  TagQuality,
  createTagBrowser,
  getTagBrowser
} from './TagBrowser.js';

/**
 * Tag path examples:
 *
 * Unit level:
 *   Sheriff.Config.Name
 *   Sheriff.Status.State
 *   Sheriff.Metrics.TotalItemsProcessed
 *   Sheriff.Alarms.HighBacklog
 *
 * Line level:
 *   Sheriff.Lines.ProcessService.Config.Name
 *   Sheriff.Lines.ProcessService.Status.IsRunning
 *   Sheriff.Lines.ProcessService.Metrics.Throughput
 *
 * Station level:
 *   Sheriff.Lines.ProcessService.Stations.ProcessIntake.Status.Utilization
 *   Sheriff.Lines.ProcessService.Stations.ProcessIntake.Metrics.ItemsProcessed
 *
 * Work item level:
 *   Sheriff.Lines.ProcessService.WIP[0].Identity.ID
 *   Sheriff.Lines.ProcessService.WIP[0].Status.State
 */

/**
 * UDT Types available:
 * - UDT_ProductionUnit: Row officer production cell
 * - UDT_AssemblyLine: Process flow / assembly line
 * - UDT_Station: Individual work station
 * - UDT_WorkItem: Transaction flowing through system
 * - UDT_Alarm: ISA-18.2 compliant alarm
 */

export const moduleInfo = {
  name: 'NAC Tags Module',
  version: '1.0.0',
  description: 'UDT templates and tag instances for digital twin',
  udtTypes: [
    'UDT_ProductionUnit',
    'UDT_AssemblyLine',
    'UDT_Station',
    'UDT_WorkItem',
    'UDT_Alarm'
  ],
  units: [
    'sheriff',
    'treasurer',
    'coroner',
    'district-attorney',
    'recorder-of-deeds',
    'register-of-wills',
    'clerk-of-courts',
    'prothonotary',
    'enterprise'
  ]
};
