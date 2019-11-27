interface IclusterListContainer {
  node_cpu_idle?: number
  node_cpu_iowait?: number
  node_cpu_load_avg_1?: number
  node_cpu_load_avg_15?: number
  node_cpu_load_avg_5?: number
  node_cpu_system?: number
  node_cpu_user?: number
  node_memory_available?: number
  node_memory_buffers?: number
  node_memory_cached?: number
  node_memory_free?: number
  node_memory_total?: number
  node_memory_used?: number
  node_memory_used_percent?: number
  id: number
  kubernetes: boolean
  name: string
}
