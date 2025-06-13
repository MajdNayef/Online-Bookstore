pipeline {
    agent any
    environment {
        JIRA_SITE = 'jira-rest-api'
    }
    stages {
        stage('Create Jira Issue') {
            steps {
                script {
                    jiraNewIssue(
            site:        env.JIRA_SITE,
            projectKey:  'DB',
            issueType:   'Task',
            summary:     "Automated Issue from Build #${env.BUILD_NUMBER}",
            description: "Created by Jenkins. Build URL: ${env.BUILD_URL}"
          )
                }
            }
        }
    }
}
