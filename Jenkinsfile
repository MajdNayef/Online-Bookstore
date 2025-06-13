pipeline {
  agent any

  environment {
    JIRA_SITE = 'jira-rest-api'   // your configured site name
  }

  stages {
    stage('Create Jira Issue') {
      steps {
        script {
          // Create the issue, no credentialsId param here
          def newIssue = jiraNewIssue(
            site: env.JIRA_SITE,
            issue: [
              fields: [
                project:    [ key: 'DP' ],               // <-- use DP, not DB
                summary:    "Automated task for Build #${env.BUILD_NUMBER}",
                description:"Jenkins build URL: ${env.BUILD_URL}",
                issuetype:  [ name: 'Task' ]
              ]
            ]
          )
          env.ISSUE_KEY = newIssue.key
          echo "Created Jira issue ${env.ISSUE_KEY}"
        }
      }
    }

    // stage('Add Success Comment') {
    //   steps {
    //     script {
    //       jiraAddComment(
    //         site:      env.JIRA_SITE,
    //         issueKey:  env.ISSUE_KEY,
    //         comment:   "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
    //       )
    //     }
    //   }
    // }

    // stage('Transition to Done') {
    //   steps {
    //     script {
    //       jiraTransitionIssue(
    //         site:       env.JIRA_SITE,
    //         issueKey:   env.ISSUE_KEY,
    //         transition: [ name: 'Done' ]            // match your Jira workflow transition
    //       )
    //     }
    //   }
    // }
  }

  post {
    failure {
      script {
        if (env.ISSUE_KEY) {
          jiraAddComment(
            site:      env.JIRA_SITE,
            issueKey:  env.ISSUE_KEY,
            comment:   "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
          )
        }
      }
    }
  }
}
