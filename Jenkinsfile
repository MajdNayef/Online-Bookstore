// you can name this whatever, but defining it here lets us share it across stages
def ISSUE_KEY = 'DB-9'

pipeline {
    agent any

    environment {
        // must match the "Name" you gave in Manage Jenkins → Configure System → Jira
        JIRA_SITE = 'jira-rest-api'
    }

    stages {
        stage('Create Jira Issue') {
            steps {
                script {
                    // this returns the new issue key, e.g. "DB-10"
                    ISSUE_KEY = jiraNewIssue(
            site:        env.JIRA_SITE,
            projectKey:  'DB',             // your Jira project key
            issueType:   'Task',           // e.g. Task, Bug, Story…
            summary:     "Automated Issue for Build #${env.BUILD_NUMBER}",
            description: "This issue was created automatically by Jenkins.\nBuild URL: ${env.BUILD_URL}"
          )
                    echo "👍 Created Jira issue ${ISSUE_KEY}"
                }
            }
        }

//         stage('Add Success Comment') {
//             steps {
//                 script {
//                     jiraAddComment(
//             site:     env.JIRA_SITE,
//             issueKey: ISSUE_KEY,
//             comment:  "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
//           )
//                 }
//             }
//         }

//         stage('Transition Issue to Done') {
//             steps {
//                 script {
//                     jiraTransitionIssue(
//             site:       env.JIRA_SITE,
//             issueKey:   ISSUE_KEY,
//             transition: 'Done'             // must match exactly a transition name in your workflow
//           )
//                 }
//             }
//         }
//   } // stages

//     post {
//         failure {
//             script {
//                 // if something goes wrong, leave a failure comment
//                 if (ISSUE_KEY) {
//                     jiraAddComment(
//             site:     env.JIRA_SITE,
//             issueKey: ISSUE_KEY,
//             comment:  "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
//           )
//                 }
//             }
        // }
    }
}
