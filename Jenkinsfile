// define a Groovy variable at the top level to share between stages
def ISSUE_KEY = 'DP-88'

pipeline {
  agent any

  environment {
    // name of your Jira site as configured in Manage Jenkins → Configure System → Jira sites
    JIRA_SITE = 'jira-rest-api'
  }

  stages {
    stage('Create Jira Issue') {
      steps {
        script {
          // call jiraNewIssue and capture the full response
          def response = jiraNewIssue(
            site: env.JIRA_SITE,
            issue: [
              fields: [
                project:     [ key: 'DP' ],
                summary:     "Automated task for Build #${env.BUILD_NUMBER}",
                description: "Build URL: ${env.BUILD_URL}",
                issuetype:   [ name: 'Task' ]
              ]
            ]
          )
          // drill into response.issue.key — not response.key
          ISSUE_KEY = response.issue.key
          echo "✅ Created issue ${ISSUE_KEY}"
        }
      }
    }

    // stage('Add Success Comment') {
    //   steps {
    //     script {
    //       jiraAddComment(
    //         site:      env.JIRA_SITE,
    //         issueKey:  ISSUE_KEY,
    //         comment:   "Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
    //       )
    //       echo "📝 Comment added to ${ISSUE_KEY}"
    //     }
    //   }
    // }

    // stage('Transition to Done') {
    //   steps {
    //     script {
    //       jiraTransitionIssue(
    //         site:       env.JIRA_SITE,
    //         issueKey:   ISSUE_KEY,
    //         transition: [ name: 'Done' ]
    //       )
    //       echo "➡️ Transitioned ${ISSUE_KEY} to Done"
    //     }
    //   }
    // }
  }

  post {
    failure {
      script {
        if (ISSUE_KEY) {
          jiraAddComment(
            site:      env.JIRA_SITE,
            issueKey:  ISSUE_KEY,
            comment:   "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
          )
          echo "❗ Failure comment added to ${ISSUE_KEY}"
        }
      }
    }
  }
}
