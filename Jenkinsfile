// Transition IDs:
// 11 : To Do
// 21 : In Progress
// 311 : In Review
// 41 : Done

pipeline {
  agent any

  environment {
    // Must match the name in Manage Jenkins → Configure System → Jira
    JIRA_SITE = 'jira-rest-api'
    // We’ll populate this if/when we create a Jira issue
    ISSUE_KEY = 'DP-12'
  }

  stages {
  //   stage('Verify Test Plan') {
  //     steps {
  //       echo "🏷️ Checking for LoadTest.jmx…"
  //       bat 'dir "%WORKSPACE%\\testplans"'
  //     }
  //   }

  //   stage('Debug Test Plan') {
  //     steps {
  //       echo "🔍 Checking LoopController.loops in LoadTest.jmx…"
  //       script {
  //         // use returnStatus so non-zero doesn’t fail the build
  //         def rc = bat(
  //           script: 'findstr /I "LoopController.loops" "%WORKSPACE%\\testplans\\LoadTest.jmx"',
  //           returnStatus: true
  //         )
  //         if (rc != 0) {
  //           echo "⚠️  LoopController.loops not found in JMX"
  //         }
  //       }
  //     }
  //   }

    // stage('Run JMeter Tests') {
    //   steps {
    //     echo "🧹 Cleaning up from previous runs…"
    //     // delete old results, log and report dir
    //     bat '''
    //       if exist "%WORKSPACE%\\results.jtl" del /Q "%WORKSPACE%\\results.jtl"
    //       if exist "%WORKSPACE%\\jmeter.log"  del /Q "%WORKSPACE%\\jmeter.log"
    //       if exist "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}" rmdir /S /Q "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
    //     '''
    //     echo "🚀 Launching JMeter in non-GUI mode (with response bodies on error)…"
    //     // wrap so failures don’t skip the next step
    //     catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
    //       bat """
    //         C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat ^
    //           -n ^
    //           -t "%WORKSPACE%\\testplans\\LoadTest.jmx" ^
    //           -l "%WORKSPACE%\\results.jtl" ^
    //           -j "%WORKSPACE%\\jmeter.log" ^
    //           -e ^
    //           -o "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}" ^
    //           -Jjmeter.save.saveservice.output_format=csv ^
    //           -Jjmeter.save.saveservice.print_field_names=true ^
    //           -Jjmeter.save.saveservice.response_data.on_error=true
    //       """
    //     }

    //     echo "📋 JMeter CLI log (jmeter.log):"
    //     // now this will always run, even if JMeter failed
    //     bat 'type "%WORKSPACE%\\jmeter.log"'

    //     echo "🔍 Failures in results.jtl…"
    //     script {
    //       // returnStatus: 0 means a match was found (i.e. there *are* failures)
    //       def failuresFound = bat(returnStatus: true, script: 'findstr /C:",false," "%WORKSPACE%\\results.jtl"')
    //       if (failuresFound == 0) {
    //         // Mark the build unstable so your Log Failure Details stage runs
    //         currentBuild.result = 'UNSTABLE'
    //       } else {
    //         echo "✅ No failures in the JTL"
    //       }
    //     }
    //   }
    // }

    // stage('Log Failure Details') {
    //   steps {
    //     script {
    //       // re-check results.jtl for failures
    //       def rc = bat(returnStatus: true, script: 'findstr /C:",false," "%WORKSPACE%\\results.jtl"')
    //       if (rc == 0) {
    //         echo "💥 JMeter failures found—here are the lines:"
    //         bat 'findstr /C:",false," "%WORKSPACE%\\results.jtl"'
    //       } else {
    //         echo "✅ No JMeter failures to log."
    //       }
    //     }
    //   }
    // }

    // --- Optional/Commented Stages ---

    // stage('Report JMeter Progress') {
    //   steps {
    //     script {
    //       def statsFile = "reports/jmeter-${env.BUILD_NUMBER}/statistics.json"
    //       if (fileExists(statsFile)) {
    //         def stats = readJSON file: statsFile
    //         def done = stats.Total.sampleCount
    //         echo "✅ JMeter has completed ${done} iteration${done == 1 ? '' : 's'} so far."
    //       } else {
    //         echo "⚠️ No JMeter statistics.json found at ${statsFile} — maybe the test hasn’t finished generating its report yet."
    //       }
    //     }
    //   }
    // }

    // stage('Create Jira Issue') {
    //   steps {
    //     script {
    //       echo "🆕 Creating Jira issue…"
    //       def resp = jiraNewIssue(
    //         site: env.JIRA_SITE,
    //         issue: [
    //           fields: [
    //             project:    [ key: 'DP' ],
    //             summary:    "JMeter Load Test Results — Build #${env.BUILD_NUMBER}",
    //             description:"See JMeter report: ${env.BUILD_URL}/HTML_20Report/",
    //             issuetype:  [ name: 'Task' ]
    //           ]
    //         ]
    //       )
    //       env.ISSUE_KEY = resp.data.key
    //       echo "✅ Created issue ${env.ISSUE_KEY}"
    //     }
    //   }
    // }

    // stage('Comment Success to Jira') {
    //   steps {
    //     script {
    //       echo "💬 Adding success comment to ${env.ISSUE_KEY}…"
    //       jiraAddComment(
    //         site:    env.JIRA_SITE,
    //         idOrKey: env.ISSUE_KEY,
    //         comment: "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
    //       )
    //     }
    //   }
    // }

    stage('Transition Jira to Done') {
      steps {
        script {
          echo "➡️ Transitioning ${env.ISSUE_KEY} to Done…"
          def transitions = jiraGetIssueTransitions(site: env.JIRA_SITE, idOrKey: env.ISSUE_KEY)
          def doneId = transitions.data.transitions.find { it.name == 'Done' }?.id
          if (doneId) {
            jiraTransitionIssue(
              site:    env.JIRA_SITE,
              idOrKey: env.ISSUE_KEY,
              input:   [ transition: [ id: doneId ] ]
            )
            echo "➡️ ${env.ISSUE_KEY} is now Done"
          } else {
            echo "⚠️ Could not find a 'Done' transition for ${env.ISSUE_KEY}"
          }
        }
      }
    }

    // stage('Build & Push Docker Image') {
    //   steps {
    //     script {
    //       echo "🐳 Building Docker image…"
    //       bat "docker build -t majdyoussef/online-bookstore:${env.BUILD_NUMBER} ."
    //       echo "🔑 Logging in & pushing to Docker Hub…"
    //       withCredentials([usernamePassword(
    //         credentialsId: 'Doc',
    //         usernameVariable: 'DOCKER_USER',
    //         passwordVariable: 'DOCKER_PASS'
    //       )]) {
    //         bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
    //         bat "docker tag majdyoussef/online-bookstore:${env.BUILD_NUMBER} majdyoussef/online-bookstore:latest"
    //         bat "docker push majdyoussef/online-bookstore:${env.BUILD_NUMBER}"
    //         bat "docker push majdyoussef/online-bookstore:latest"
    //       }
    //     }
    //   }
    // }
  }

  // --- Post Actions (commented out) ---
  // post {
  //   always {
  //     echo "📦 Archiving JMeter outputs…"
  //     archiveArtifacts artifacts: 'results.jtl, jmeter.log', fingerprint: true
  //   }
  //   success {
  //     echo "📊 Publishing JMeter HTML report…"
  //     publishHTML([
  //       reportDir:             "reports/jmeter-${env.BUILD_NUMBER}",
  //       reportFiles:           'index.html',
  //       reportName:            'JMeter HTML Report',
  //       keepAll:               true,
  //       alwaysLinkToLastBuild: true,
  //       allowMissing:          false
  //     ])
  //   }
  //   failure {
  //     script {
  //       if (env.ISSUE_KEY) {
  //         echo "💥 Notifying Jira of failure…"
  //         jiraAddComment(
  //           site:    env.JIRA_SITE,
  //           idOrKey: env.ISSUE_KEY,
  //           comment: "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
  //         )
  //       }
  //     }
    // }
  // }
}
