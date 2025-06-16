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

    stage('Verify Test Plan') {
      steps {
        // List the workspace contents so you can see testplans/LoadTest.jmx
        bat 'dir "%WORKSPACE%\\testplans"'
      }
    }

stage('Run JMeter Tests') {
  steps {
    // create the reports dir
    bat 'if not exist "%WORKSPACE%\\reports" mkdir "%WORKSPACE%\\reports"'
    // run JMeter with a dedicated log file
    bat """
      C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat ^
        -n ^
        -t "%WORKSPACE%\\testplans\\LoadTest.jmx" ^
        -l "%WORKSPACE%\\results.jtl" ^
        -j "%WORKSPACE%\\jmeter.log" ^
        -e ^
        -o "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
    """
  }
}

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
    //       // Replace 31 with the actual ID you saw for 'Done'
    //       jiraTransitionIssue(
    //         site: env.JIRA_SITE,
    //         idOrKey: ISSUE_KEY,
    //         input: [ transition: [ id: 31 ] ]
    //       )
    //       echo "➡️ Transitioned ${ISSUE_KEY} to Done"
    //     }
    //   }
    // }

    // stage('Build & Push Docker Image') {
    //   steps {
    //     script {
    //       // Build the image
    //       bat "docker build -t majdyoussef/online-bookstore:${env.BUILD_NUMBER} ."

    //       // Log in to Docker Hub
    //       withCredentials([usernamePassword(
    //         credentialsId: 'Doc',
    //         usernameVariable: 'DOCKER_USER',
    //         passwordVariable: 'DOCKER_PASS'
    //       )]) {
    //         bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"

    //         // Tag the image as latest and push both tags
    //         bat "docker tag majdyoussef/online-bookstore:${env.BUILD_NUMBER} majdyoussef/online-bookstore:latest"
    //         bat "docker push majdyoussef/online-bookstore:${env.BUILD_NUMBER}"
    //         bat "docker push majdyoussef/online-bookstore:latest"
    //       }
    //     }
    //   }
    // }

  }

  post {
  always {
    // archive the JMeter CLI log
    archiveArtifacts artifacts: 'jmeter.log', fingerprint: true
  }
  success {
    // only publish HTML if JMeter actually succeeded and created the folder
    publishHTML([
      reportDir:             "reports/jmeter-${env.BUILD_NUMBER}",
      reportFiles:           'index.html',
      reportName:            'JMeter HTML Report',
      allowMissing:          false,
      keepAll:               true,
      alwaysLinkToLastBuild: true
    ])
  }

    failure {
      script {
        if (ISSUE_KEY) {
          jiraAddComment(
            site: env.JIRA_SITE,
            idOrKey: ISSUE_KEY,
            comment: "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
          )
          echo "❗ Failure comment added to ${ISSUE_KEY}"
        }
      }
    }
  }
}


