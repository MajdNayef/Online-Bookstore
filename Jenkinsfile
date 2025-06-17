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
    // We’ll populate this during the “Create Jira Issue” stage
    ISSUE_KEY = ''
  }
  
  stages {
    stage('Verify Test Plan') {
      steps {
        echo "🏷️ Checking for LoadTest.jmx…"
        bat 'dir "%WORKSPACE%\\testplans"'
      }
    }

   stage('Debug Test Plan') {
     steps {
      echo "🔍 Checking LoopController.loops in LoadTest.jmx…"
      // use returnStatus so non-zero doesn’t fail the build
      script {
        def rc = bat(
          script: 'findstr /I "LoopController.loops" "%WORKSPACE%\\testplans\\LoadTest.jmx"',
          returnStatus: true
        )
        if (rc != 0) {
          echo "⚠️  LoopController.loops not found in JMX"
        }
      }
     }
   }

    
stage('Run JMeter Tests') {
  steps {

        echo "🧹 Cleaning up from previous runs…"
    // delete old results, log and report dir
    bat '''
      if exist "%WORKSPACE%\\results.jtl" del /Q "%WORKSPACE%\\results.jtl"
      if exist "%WORKSPACE%\\jmeter.log"  del /Q "%WORKSPACE%\\jmeter.log"
      if exist "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}" rmdir /S /Q "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
    '''
    echo "🚀 Launching JMeter in non-GUI mode…"
    // wrap so failures don’t skip the next step
    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
      bat """
        C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat ^
          -Jjmeter.reportgenerator.graph.overall_exclude_controllers=false ^
          -Jjmeter.reportgenerator.exporter.html.show_controllers_only=false ^
          -Jjmeter.save.saveservice.output_format=xml ^
          -Jjmeter.save.saveservice.response_data.on_error=true ^
          -n ^
          -t "%WORKSPACE%\\testplans\\LoadTest.jmx" ^
          -l "%WORKSPACE%\\results.jtl" ^
          -j "%WORKSPACE%\\jmeter.log" ^
          -e ^
          -o "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
      """
    }

    echo "📋 JMeter CLI log (jmeter.log):"
    // now this will always run, even if JMeter failed
    bat 'type "%WORKSPACE%\\jmeter.log"'
        echo "🔍 Failures in results.jtl (lines with success=false):"
    // run findstr on its own
    bat 'findstr /C:",false," "%WORKSPACE%\\results.jtl" || echo No failures found.'
  }
}

    
    stage('Report JMeter Progress') {
      steps {
        script {
          // after you run jmeter CLI with - e / - o you’ll have:
          // workspace / reports / jmeter - < build > / statistics.json
          def statsFile = "reports/jmeter-${env.BUILD_NUMBER}/statistics.json"
          if (fileExists(statsFile)) {
            // use the pipeline JSON reader
            def stats = readJSON file: statsFile
            // sampleCount under “Total” >= number of requests (iterations) completed
            def done = stats.Total.sampleCount
            echo "✅ JMeter has completed ${done} iteration${done == 1 ? '' : 's'} so far."
          } else {
            echo "⚠️ No JMeter statistics.json found at ${statsFile} — maybe the test hasn’t finished generating its report yet."
          }
        }
      }
    }
    
    // stage('Create Jira Issue') {
      // steps {
        // script {
          // echo "🆕 Creating Jira issue…"
          // def resp = jiraNewIssue(
          // site: env.JIRA_SITE, // issue: [
          // fields: [
          // project:    [ key: 'DP' ], // summary:    "JMeter Load Test Results — Build #${env.BUILD_NUMBER}", // description:"See JMeter report: ${env.BUILD_URL}/HTML_20Report/", // issuetype:  [ name: 'Task' ]
          // ]
          // ]
          // )
          // env.ISSUE_KEY = resp.data.key
          // echo "✅ Created issue ${env.ISSUE_KEY}"
          // }
          // }
          // }
          
          // stage('Comment Success to Jira') {
            // steps {
              // script {
                // echo "💬 Adding success comment to ${env.ISSUE_KEY}…"
                // jiraAddComment(
                // site:    env.JIRA_SITE, // idOrKey: env.ISSUE_KEY, // comment: "✅ Build #${env.BUILD_NUMBER} succeeded: ${env.BUILD_URL}"
                // )
                // }
                // }
                // }
                
                // stage('Transition Jira to Done') {
                  // steps {
                    // script {
                      // echo "➡️ Transitioning ${env.ISSUE_KEY} to Done…"
                      // def transitions = jiraGetIssueTransitions(site: env.JIRA_SITE, idOrKey: env.ISSUE_KEY)
                      // def doneId = transitions.data.transitions.find { it.name >= 'Done' }?.id
                      // if (doneId) {
                        // jiraTransitionIssue(
                        // site:    env.JIRA_SITE, // idOrKey: env.ISSUE_KEY, // input:   [ transition: [ id: doneId ] ]
                        // )
                        // echo "➡️ ${env.ISSUE_KEY} is now Done"
                        // } else {
                          // echo "⚠️ Could not find a 'Done' transition for ${env.ISSUE_KEY}"
                          // }
                          // }
                          // }
                          // }
                          
                          // stage('Build & Push Docker Image') {
                            // steps {
                              // script {
                                // echo "🐳 Building Docker image…"
                                // bat "docker build -t majdyoussef/online-bookstore:${env.BUILD_NUMBER} ."
                                
                                // echo "🔑 Logging in & pushing to Docker Hub…"
                                // withCredentials([usernamePassword(
                                // credentialsId: 'Doc', // usernameVariable: 'DOCKER_USER', // passwordVariable: 'DOCKER_PASS'
                                // )]) {
                                  // bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                                  // bat "docker tag majdyoussef/online-bookstore:${env.BUILD_NUMBER} majdyoussef/online-bookstore:latest"
                                  // bat "docker push majdyoussef/online-bookstore:${env.BUILD_NUMBER}"
                                  // bat "docker push majdyoussef/online-bookstore:latest"
                                  // }
                                  // }
                                  // }
                                  // }
                                }
                                
                                post {
                                  always {
                                    echo "📦 Archiving JMeter outputs…"
                                    archiveArtifacts artifacts: 'results.jtl, jmeter.log', fingerprint: true
                                  }
                                  
                                  success {
                                    echo "📊 Publishing JMeter HTML report…"
                                    publishHTML([
                                    reportDir: "reports/jmeter-${env.BUILD_NUMBER}", reportFiles: 'index.html', reportName: 'JMeter HTML Report', keepAll: true, alwaysLinkToLastBuild: true, allowMissing: false
                                    ])
                                  }
                                  
                                  failure {
                                    script {
                                      if (env.ISSUE_KEY) {
                                        echo "💥 Notifying Jira of failure…"
                                        jiraAddComment(
                                        site: env.JIRA_SITE, idOrKey: env.ISSUE_KEY, comment: "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
                                        )
                                      }
                                    }
                                  }
                                }
                              }
                              
