pipeline {
    agent any

    tools {
        nodejs 'NodeJS22'
    }

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        DOCKERHUB_USERNAME = 'mudasir18'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/ticket-backend:v1"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/ticket-frontend:v1"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE backend'
                sh 'docker build -t $FRONTEND_IMAGE frontend'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/
                kubectl rollout restart deployment/ticket-backend
                kubectl rollout restart deployment/ticket-frontend
                '''
            }
        }
    }
}
