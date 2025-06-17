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
    
    stage('Run JMeter Tests') {
      steps {
        echo "🚀 Launching JMeter in non-GUI mode…"
        bat """
        C:\\apache - jmeter - 5.6.3\\bin\\jmeter.bat ^
        - n ^
        - t "%WORKSPACE%\\testplans\\LoadTest.jmx" ^
        - l "%WORKSPACE%\\results.jtl" ^
        - j "%WORKSPACE%\\jmeter.log" ^
        - e ^
        - o "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
        """
        
        //* * Dump the CLI log immediately afterwards * *
        echo "📋 JMeter CLI log (jmeter.log):"
        bat 'type "%WORKSPACE%\\jmeter.log"'
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
                              