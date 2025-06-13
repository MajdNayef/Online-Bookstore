pipeline {
    agent any

    environment {
        // Make sure this matches the Name you set in Manage Jenkins → Configure System → Jira
        JIRA_SITE = 'jira-rest-api'
    }

    stages {
        stage('Update Jira Issue') {
            steps {
                script {
                    // This is the snippet you generated, with the 'site' added
                    jiraComment(
            site:     env.JIRA_SITE,
            issueKey: 'DB-7',          // the issue you want to update
            body:     'Test 1'         // your comment text
          )
                }
            }
        }
    }
}
