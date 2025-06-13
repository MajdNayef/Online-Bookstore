// Declare this up here so all stages can see it
// Transition IDs:
//  11 : To Do
//  21 : In Progress
//  311 : In Review
//  41 : Done

def ISSUE_KEY = 'DP-7'

pipeline {
    agent any

    environment {
        // Must match your Jenkins config
        JIRA_SITE = 'jira-rest-api'
    }

    stages {
        // stage('List Jira Transitions') {
        //     steps {
        //         script {
        //             // Call the plugin step that returns available transitions
        //             def resp = jiraGetIssueTransitions(
        //                 site: env.JIRA_SITE,
        //                 idOrKey: ISSUE_KEY
        //             )
        //             // The transitions usually live under resp.data.transitions
        //             resp.data.transitions.each { t ->
        //                 echo "→ ${t.id} : ${t.name}"
        //             }
        //         }
        //     }
        // }

        // stage('Create Jira Issue') {
        //     steps {
        //         script {
        //             // 1) Create the issue
        //             def response = jiraNewIssue(
        //                 site: env.JIRA_SITE,
        //                 issue: [
        //                     fields: [
        //                         project: [ key: 'DP' ], // Your real project key
        //                         summary: "Automated task for Build #${env.BUILD_NUMBER}",
        //                         description: "Jenkins build URL: ${env.BUILD_URL}",
        //                         issuetype: [ name: 'Task' ] // Or Bug, Story, etc.
        //                     ]
        //                 ]
        //             )
        //             // 2) Extract the key from response.data.key
        //             ISSUE_KEY = response.data.key
        //             echo "✅ Created Jira issue ${ISSUE_KEY}"
        //         }
        //     }
        // }

        // stage('Add Success Comment') {
        //     steps {
        //         script {
        //             // Note: Use idOrKey, not issueKey
        //             jiraAddComment(
        //                 site: env.JIRA_SITE,
        //                 idOrKey: ISSUE_KEY,
        //                 comment: "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
        //             )
        //             echo "📝 Added success comment to ${ISSUE_KEY}"
        //         }
        //     }
        // }

        stage('Transition to Done') {
            steps {
                script {
                    jiraTransitionIssue(
                        site: env.JIRA_SITE,
                        idOrKey: ISSUE_KEY,
                        input: [ transition: [ id: '41' ] ]
                    )
                    echo "➡️ Transitioned ${ISSUE_KEY} to Done"
                }
            }
        }
    }

    // post {
    //     failure {
    //         script {
    //             if (ISSUE_KEY) {
    //                 jiraAddComment(
    //                     site: env.JIRA_SITE,
    //                     idOrKey: ISSUE_KEY,
    //                     comment: "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
    //                 )
    //                 echo "❗ Added failure comment to ${ISSUE_KEY}"
    //             }
    //         }
    //     }
    // }
}
