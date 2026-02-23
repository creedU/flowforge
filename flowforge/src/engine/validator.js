/**
 * validator.js
 * Graph validation engine for FlowForge.
 * Checks: trigger presence, cyclic dependencies, required fields.
 */

/**
 * Detects cycles in a directed graph using DFS.
 * Returns true if a cycle exists.
 */
function hasCycle(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  const visited = new Set();
  const inStack = new Set();

  function dfs(id) {
    visited.add(id);
    inStack.add(id);

    for (const neighbor of adj[id] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }

    inStack.delete(id);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

/**
 * Checks if any nodes are disconnected (no edges at all in a multi-node workflow).
 */
function findDisconnectedNodes(nodes, edges) {
  if (nodes.length <= 1) return [];
  const connected = new Set();
  edges.forEach((e) => {
    connected.add(e.source);
    connected.add(e.target);
  });
  return nodes.filter((n) => !connected.has(n.id)).map((n) => n.data.label || n.id);
}

/**
 * Main validation function.
 * Returns an array of error strings. Empty array = valid.
 */
export function validateWorkflow(nodes, edges) {
  const errors = [];

  // 1. Must have at least one node
  if (nodes.length === 0) {
    errors.push('Workflow is empty. Add at least one Trigger node to begin.');
    return errors;
  }

  // 2. Must have at least one Trigger node
  const triggerNodes = nodes.filter((n) => n.data.nodeType === 'trigger');
  if (triggerNodes.length === 0) {
    errors.push('Missing Trigger node. Every workflow must start with a Trigger.');
  }

  // 3. Detect cyclic dependencies
  if (hasCycle(nodes, edges)) {
    errors.push('Cyclic dependency detected. Workflow must be a directed acyclic graph (DAG).');
  }

  // 4. Validate required fields per node
  nodes.forEach((n) => {
    if (!n.data.label || n.data.label.trim() === '') {
      errors.push(`A node is missing a label. Open it in the config panel and add a name.`);
    }
  });

  // 5. Warn about disconnected nodes (non-blocking, but useful)
  if (nodes.length > 1) {
    const disconnected = findDisconnectedNodes(nodes, edges);
    if (disconnected.length > 0) {
      errors.push(
        `Disconnected node(s) found: "${disconnected.join('", "')}". Connect them or remove them.`
      );
    }
  }

  return errors;
}

/**
 * Returns warnings (non-blocking issues).
 */
export function getWorkflowWarnings(nodes, edges) {
  const warnings = [];

  const triggerNodes = nodes.filter((n) => n.data.nodeType === 'trigger');
  if (triggerNodes.length > 1) {
    warnings.push(`Multiple Trigger nodes found (${triggerNodes.length}). Only the first will execute.`);
  }

  return warnings;
}
