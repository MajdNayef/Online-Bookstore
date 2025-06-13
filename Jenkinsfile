pipeline {
    agent any

    environment {
        // matches the “Name” you gave in Manage Jenkins → Configure System → Jira
        JIRA_SITE = 'jira-rest-api'
    }

    stages {
        stage('Checkout & Build') {
            steps {
            // …
            }
        }

        stage('Run Tests') {
            steps {
            // …
            }
        }
    }

    post {
        failure {
            script {
                // 1. Automatically create a new Jira issue on failure
                def newIssue = jiraNewIssue(
          site:        "${JIRA_SITE}",
          projectKey:  'OBD',              // your Jira Project Key
          type:        'Bug',
          summary:     "Build failed #${env.BUILD_NUMBER}",
          description: "Jenkins build [${env.BUILD_URL}] failed. Please investigate."
        )
                echo "Created issue ${newIssue}"

                // 2. Add a comment to that new issue
                jiraAddComment(
          site:      "${JIRA_SITE}",
          issueKey:  newIssue,
          body:      'Automated ticket raised by Jenkins pipeline on build failure.'
        )
            }
        }
        success {
            script {
                // If you know the issue key (e.g. from a previous run), you can update it on success:
                def issueKey = 'OBD-42'  // or store this in a file/artifact
                jiraAddComment(
          site:     "${JIRA_SITE}",
          issueKey: issueKey,
          body:     "✅ Build #${env.BUILD_NUMBER} succeeded. Closing out."
        )
            // Optionally transition it:
            // jiraTransitionIssue(site: "${JIRA_SITE}", issueKey: issueKey, transition: 'Done')
            }
        }
    }
}
