// Transition IDs:
//  11 : To Do
//  21 : In Progress
//  311 : In Review
//  41 : Done

def ISSUE_KEY = 'DP-7'

pipeline {
  agent any

  environment {
    JIRA_SITE = 'jira-rest-api'
  }

  stages {
    // stage('Create Jira Issue') {
    //   steps {
    //     script {
    //       def resp = jiraNewIssue(
    //         site: env.JIRA_SITE,
    //         issue: [
    //           fields: [
    //             project: [ key: 'DP' ],
    //             summary: "Automated task for Build #${env.BUILD_NUMBER}",
    //             description: "Build URL: ${env.BUILD_URL}",
    //             issuetype: [ name: 'Task' ]
    //           ]
    //         ]
    //       )
    //       ISSUE_KEY = resp.data.key
    //       echo "✅ Created issue ${ISSUE_KEY}"
    //     }
    //   }
    // }

    // stage('Add Success Comment') {
    //   steps {
    //     script {
    //       jiraAddComment(
    //         site: env.JIRA_SITE,
    //         idOrKey: ISSUE_KEY,
    //         comment: "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
    //       )
    //       echo "📝 Comment added to ${ISSUE_KEY}"
    //     }
    //   }
    // }

    // stage('List Jira Transitions') {
    //   steps {
    //     script {
    //       def resp = jiraGetIssueTransitions(
    //         site: env.JIRA_SITE,
    //         idOrKey: ISSUE_KEY
    //       )
    //       resp.data.transitions.each { t ->
    //         echo "→ ${t.id} : ${t.name}"
    //       }
    //     }
    //   }
    // }

    // stage('Transition to Done') {
    //   steps {
    //     script {
    //       // replace 31 with the actual ID you saw for 'Done'
    //       jiraTransitionIssue(
    //         site: env.JIRA_SITE,
    //         idOrKey: ISSUE_KEY,
    //         input: [ transition: [ id: 31 ] ]
    //       )
    //       echo "➡️ Transitioned ${ISSUE_KEY} to Done"
    //     }
    //   }
    // }

     stage('Build & Push Docker Image') {
      steps {
        script {
          // 1) Build the image
          def image = docker.build("majdyoussef/online-bookstore:${env.BUILD_NUMBER}")

          // 2) Push it to Docker Hub
          docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
            image.push('latest')                   // tag “latest”
            image.push("${env.BUILD_NUMBER}")      // also push with build-number tag
          }

          echo "📦 Pushed image your-docker-user/online-bookstore:${env.BUILD_NUMBER} and :latest"
        }
      }
    }
  }
  

//   post {
//     failure {
//       script {
//         if (ISSUE_KEY) {
//           jiraAddComment(
//             site: env.JIRA_SITE,
//             idOrKey: ISSUE_KEY,
//             comment: "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
//           )
//           echo "❗ Failure comment added to ${ISSUE_KEY}"
//         }
//       }
//     }
//   }
}
