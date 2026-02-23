/**
 * executor.js
 * Workflow simulation engine for FlowForge.
 * Performs topological sort and async step-by-step execution.
 */

import { validateWorkflow } from './validator';

/**
 * Topological sort using Kahn's algorithm (BFS-based).
 * Returns sorted array of node IDs, or null if cycle detected.
 */
function topologicalSort(nodes, edges) {
  const adj = {};
  const inDegree = {};

  nodes.forEach((n) => {
    adj[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    if (adj[e.source]) {
      adj[e.source].push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }
  });

  // Start with trigger nodes first, then other zero-in-degree nodes
  const queue = nodes
    .filter((n) => inDegree[n.id] === 0)
    .sort((a, b) => {
      if (a.data.nodeType === 'trigger') return -1;
      if (b.data.nodeType === 'trigger') return 1;
      return 0;
    })
    .map((n) => n.id);

  const result = [];

  while (queue.length > 0) {
    const curr = queue.shift();
    result.push(curr);

    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result.length === nodes.length ? result : null;
}

/**
 * Simulates execution of a single node with async delay.
 * Returns { success: boolean, message: string }
 */
async function simulateNodeExecution(node) {
  const delay = 600 + Math.random() * 600; // 600–1200ms per node
  await new Promise((res) => setTimeout(res, delay));

  // Simulate occasional failures for condition nodes (for realism)
  if (node.data.nodeType === 'condition' && Math.random() < 0.15) {
    return { success: false, message: `Condition "${node.data.label}" evaluated to FALSE — branch skipped.` };
  }

  const messages = {
    trigger: `Trigger "${node.data.label}" fired successfully.`,
    action: `Action "${node.data.label}" executed — task complete.`,
    condition: `Condition "${node.data.label}" evaluated to TRUE — continuing.`,
    delay: `Delay "${node.data.label}" waited ${node.data.config?.duration || 1}s.`,
    notification: `Notification "${node.data.label}" sent successfully.`,
    transform: `Transform "${node.data.label}" processed data.`,
  };

  return {
    success: true,
    message: messages[node.data.nodeType] || `Node "${node.data.label}" executed.`,
  };
}

/**
 * Main execution function.
 * Validates, sorts, and runs the workflow step by step.
 */
export async function runWorkflow(nodes, edges, setExecutingNodeId, addLog, onComplete) {
  // Step 1: Validate
  const errors = validateWorkflow(nodes, edges);
  if (errors.length > 0) {
    errors.forEach((err) =>
      addLog({ message: err, status: 'error', nodeLabel: 'Validation' })
    );
    onComplete && onComplete(false);
    return;
  }

  // Step 2: Topological sort
  const sortedIds = topologicalSort(nodes, edges);
  if (!sortedIds) {
    addLog({
      message: 'Execution aborted: could not determine execution order (cycle detected).',
      status: 'error',
      nodeLabel: 'Executor',
    });
    onComplete && onComplete(false);
    return;
  }

  addLog({
    message: `Starting execution — ${sortedIds.length} node(s) in queue.`,
    status: 'info',
    nodeLabel: 'Engine',
  });

  await new Promise((res) => setTimeout(res, 300));

  let allSuccess = true;

  // Step 3: Execute each node in order
  for (const id of sortedIds) {
    const node = nodes.find((n) => n.id === id);
    if (!node) continue;

    setExecutingNodeId(id);
    addLog({
      message: `Running: ${node.data.label}…`,
      status: 'running',
      nodeLabel: node.data.label,
    });

    const result = await simulateNodeExecution(node);

    addLog({
      message: result.message,
      status: result.success ? 'success' : 'warning',
      nodeLabel: node.data.label,
    });

    if (!result.success) {
      allSuccess = false;
    }
  }

  setExecutingNodeId(null);

  await new Promise((res) => setTimeout(res, 200));

  addLog({
    message: allSuccess
      ? '✓ Workflow completed successfully.'
      : '⚠ Workflow completed with warnings.',
    status: allSuccess ? 'success' : 'warning',
    nodeLabel: 'Engine',
  });

  onComplete && onComplete(allSuccess);
}
