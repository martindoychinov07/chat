terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Create a Docker network for communication between services
resource "docker_network" "chat_net" {
  name = "chat-network"
}

# PostgreSQL container
resource "docker_image" "postgres" {
  name = "postgres:15"
}

resource "docker_container" "postgres" {
  name  = "chat-postgres"
  image = docker_image.postgres.name
  networks_advanced {
    name = docker_network.chat_net.name
  }
  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=your-password",
    "POSTGRES_DB=postgres"
  ]
  ports {
    internal = 5432
    external = 5432
  }
}

# Backend (Express) container
resource "docker_image" "backend" {
  name = "chat-backend"
  build {
    context = "${path.module}/../server"
  }
}

resource "docker_container" "backend" {
  name  = "chat-backend"
  image = docker_image.backend.name
  networks_advanced {
    name = docker_network.chat_net.name
  }
  ports {
    internal = 5000
    external = 5000
  }
  
  env = [
    "PG_HOST=chat-postgres",
    "PG_USER=postgres",
    "PG_PASSWORD=your-password",
    "PG_DATABASE=postgres"
  ]

  depends_on = [docker_container.postgres]
}

# Frontend (React) container
resource "docker_image" "frontend" {
  name = "chat-frontend"
  build {
    context = "${path.module}/../client"
  }
}

resource "docker_container" "frontend" {
  name  = "chat-frontend"
  image = docker_image.frontend.name
  networks_advanced {
    name = docker_network.chat_net.name
  }
ports {
  internal = 80
  external = 3000
}
  depends_on = [docker_container.backend]
}
