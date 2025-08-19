#!/bin/bash

# CalcBuilder Pro - Docker Development Script
# Easy management of development containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project name
PROJECT_NAME="calcbuilder"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting CalcBuilder development environment..."
    
    # Create necessary directories
    mkdir -p nginx/logs nginx/ssl
    
    # Generate self-signed SSL certificate for local development
    if [ ! -f nginx/ssl/localhost.crt ]; then
        print_status "Generating self-signed SSL certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/localhost.key \
            -out nginx/ssl/localhost.crt \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    fi
    
    # Start services
    docker-compose up -d frontend nginx
    
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Nginx: http://localhost (redirects to https)"
    print_status "Nginx: https://localhost"
    print_status "Health check: https://localhost/health"
}

# Function to start full development environment (including local services)
start_full() {
    print_status "Starting full CalcBuilder development environment..."
    
    # Create necessary directories
    mkdir -p nginx/logs nginx/ssl
    
    # Generate self-signed SSL certificate for local development
    if [ ! -f nginx/ssl/localhost.crt ]; then
        print_status "Generating self-signed SSL certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/localhost.key \
            -out nginx/ssl/localhost.crt \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    fi
    
    # Start all services including local development tools
    docker-compose --profile local-dev up -d
    
    print_success "Full development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Nginx: https://localhost"
    print_status "Local Supabase: localhost:5432"
    print_status "Redis: localhost:6379"
    print_status "Mailhog: http://localhost:8025"
    print_status "Health check: https://localhost/health"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping CalcBuilder development environment..."
    docker-compose down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting CalcBuilder development environment..."
    docker-compose restart
    print_success "Development environment restarted!"
}

# Function to view logs
view_logs() {
    local service=${1:-"all"}
    
    if [ "$service" = "all" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service service..."
        docker-compose logs -f "$service"
    fi
}

# Function to rebuild containers
rebuild() {
    print_status "Rebuilding CalcBuilder containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Containers rebuilt and started!"
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up CalcBuilder development environment..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "CalcBuilder development environment status:"
    docker-compose ps
}

# Function to show help
show_help() {
    echo "CalcBuilder Pro - Docker Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start development environment (frontend + nginx)"
    echo "  start-full  Start full development environment (including local services)"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  logs        View logs (all services)"
    echo "  logs [SERVICE] View logs for specific service"
    echo "  rebuild     Rebuild and restart containers"
    echo "  cleanup     Remove all containers, volumes, and images"
    echo "  status      Show container status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs frontend"
    echo "  $0 start-full"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    case "${1:-help}" in
        start)
            start_dev
            ;;
        start-full)
            start_full
            ;;
        stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        logs)
            view_logs "$2"
            ;;
        rebuild)
            rebuild
            ;;
        cleanup)
            cleanup
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
