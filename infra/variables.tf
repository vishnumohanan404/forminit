variable "civo_api_key" {
  type        = string
  description = "Civo API key for authentication"
}

variable "civo_cluster_name" {
  type        = string
  description = "Name of the Kubernetes cluster"
  default     = "my-cluster"
}

variable "civo_region" {
  type        = string
  description = "Civo region to deploy the cluster"
  default     = "LON1"
}

variable "civo_cluster_nodes" {
  type        = number
  description = "Number of nodes in the cluster"
  default     = 3
}

variable "civo_nodes_size" {
  type        = string
  description = "Size of the nodes"
  default     = "g3.k3s.medium"
}

# New variable for node count in pools
variable "civo_node_count" {
  type        = number
  description = "Number of nodes in the pool"
  default     = 3
}

variable "k8s_namespace" {
  type        = string
  description = "Kubernetes namespace to create"
  default     = "my-namespace"
}
