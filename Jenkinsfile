pipeline {
  agent any

  environment {
    // These must match your Jenkins config
    JIRA_SITE       = 'jira-rest-api'
    JIRA_CRED_ID    = 'jira-creds'
  }

  stages {
    stage('Create Jira Issue') {
      steps {
        script {
          // Create a new issue and capture the key (e.g. "DB-10")
          def newIssue = jiraNewIssue(
            site:           env.JIRA_SITE,
            credentialsId:  env.JIRA_CRED_ID,
            issue: [
              fields: [
                project:   [ key: 'DB' ],                 // your project key
                summary:   "Automated task for Build #${env.BUILD_NUMBER}",
                description: "Jenkins build URL: ${env.BUILD_URL}",
                issuetype: [ name: 'Task' ]               // or Bug, Story, etc.
              ]
            ]
          )
          // Expose it to later stages
          env.ISSUE_KEY = newIssue.key
          echo "🆕 Created Jira issue ${env.ISSUE_KEY}"
        }
      }
    }

    // stage('Add Success Comment') {
    //   steps {
    //     script {
    //       jiraAddComment(
    //         site:           env.JIRA_SITE,
    //         credentialsId:  env.JIRA_CRED_ID,
    //         issueKey:       env.ISSUE_KEY,
    //         comment:        "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
    //       )
    //     }
    //   }
    // }

    // stage('Transition to Done') {
    //   steps {
    //     script {
    //       jiraTransitionIssue(
    //         site:           env.JIRA_SITE,
    //         credentialsId:  env.JIRA_CRED_ID,
    //         issueKey:       env.ISSUE_KEY,
    //         // You can also use transition: [id: '31'] if your workflow IDs differ
    //         transition:     [ name: 'Done' ]  
    //       )
    //     }
    //   }
    // }
  } // stages

//   post {
//     failure {
//       script {
//         if (env.ISSUE_KEY) {
//           jiraAddComment(
//             site:           env.JIRA_SITE,
//             credentialsId:  env.JIRA_CRED_ID,
//             issueKey:       env.ISSUE_KEY,
//             comment:        "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
//           )
//         }
//       }
//     }
//   }
}
