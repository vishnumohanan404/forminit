
resource "civo_network" "custom_network" {
  label = "custom-network"

}


# Define a firewall for the Kubernetes cluster
resource "civo_firewall" "my_firewall" {
  name                 = "my-firewall"
  create_default_rules = true
  network_id           = civo_network.custom_network.id
}

# Define the Kubernetes cluster
resource "civo_kubernetes_cluster" "my_cluster" {
  name        = "my-cluster"
  firewall_id = civo_firewall.my_firewall.id # Reference the firewall ID here
  network_id  = civo_network.custom_network.id
  pools {
    node_count = 3
    size       = "g4s.kube.small"
  }

  #   depends_on = [civo_firewall.my_firewall] # Ensure the firewall is created first
}

# Output kubeconfig as a string
output "kubeconfig" {
  value     = civo_kubernetes_cluster.my_cluster.kubeconfig
  sensitive = true
}
resource "local_file" "kubeconfig" {
  filename = "/tmp/${civo_kubernetes_cluster.my_cluster.name}-kubeconfig" # Define the path and file name
  content  = civo_kubernetes_cluster.my_cluster.kubeconfig
}

# Set up the Kubernetes provider using the kubeconfig details from Civo
provider "kubernetes" {
  config_path = local_file.kubeconfig.filename
}

# Create a namespace in the Kubernetes cluster
resource "kubernetes_namespace" "my_namespace" {
  metadata {
    name = var.k8s_namespace
  }
  depends_on = [civo_kubernetes_cluster.my_cluster]
}
