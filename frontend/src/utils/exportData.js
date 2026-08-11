/**
 * Export Data Utility
 *
 * Consolidates the user's personal WiseMindOS data (goals, tasks,
 * projects, habits, daily planner, and notebooks) into a single
 * downloadable JSON backup file, generated entirely client-side.
 *
 * Follows the same Blob + anchor download pattern already used for
 * weekly analytics CSV export elsewhere in Dashboard.jsx.
 */

/**
 * Builds the export payload from the current app state.
 * Accepts the raw state slices (not the whole context) so this
 * stays a pure, testable function with no React dependency.
 */
export function buildExportPayload({
  goals = [],
  tasks = [],
  projects = [],
  habits = [],
  dailyPlan = null,
  notebooks = [],
  user = null,
}) {
  return {
    exportedAt: new Date().toISOString(),
    appVersion: 'wisemindos-export-v1',
    user: user
      ? {
          name: user.name ?? null,
          username: user.username ?? null,
        }
      : null,
    goals,
    tasks,
    projects,
    habits,
    dailyPlan,
    notebooks,
  };
}

/**
 * Triggers a client-side download of the given data as a JSON file.
 * Mirrors the Blob -> createObjectURL -> anchor.click() pattern used
 * by downloadWeeklyAnalyticsCsv in Dashboard.jsx.
 */
export function downloadJsonBackup(payload, filenamePrefix = 'wisemindos_backup') {
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  const dateLabel = new Date().toISOString().split('T')[0];

  anchor.href = downloadUrl;
  anchor.download = `${filenamePrefix}_${dateLabel}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Convenience helper: builds the payload and immediately downloads it.
 * This is what the "Export Data" button calls directly.
 */
export function exportWorkspaceData(stateSlices) {
  const payload = buildExportPayload(stateSlices);
  downloadJsonBackup(payload);
}