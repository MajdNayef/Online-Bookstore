pipeline {
  agent any

  environment {
    // Must match the name in Manage Jenkins → Configure System → Jira
    JIRA_SITE  = 'jira-rest-api'
    // We’ll populate this if/when we create a Jira issue
    ISSUE_KEY  = ''
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
        bat '''
          if exist "%WORKSPACE%\\results.jtl" del /Q "%WORKSPACE%\\results.jtl"
          if exist "%WORKSPACE%\\jmeter.log"  del /Q "%WORKSPACE%\\jmeter.log"
          if exist "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}" rmdir /S /Q "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}"
        '''
        echo "🚀 Launching JMeter in non-GUI mode (with response bodies on error)…"
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          bat """
            C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat ^
              -n ^
              -t "%WORKSPACE%\\testplans\\LoadTest.jmx" ^
              -l "%WORKSPACE%\\results.jtl" ^
              -j "%WORKSPACE%\\jmeter.log" ^
              -e ^
              -o "%WORKSPACE%\\reports\\jmeter-${env.BUILD_NUMBER}" ^
              -Jjmeter.save.saveservice.output_format=csv ^
              -Jjmeter.save.saveservice.print_field_names=true ^
              -Jjmeter.save.saveservice.response_data.on_error=true
          """
        }
        echo "📋 JMeter CLI log (jmeter.log):"
        bat 'type "%WORKSPACE%\\jmeter.log"'
      }
    }

    stage('Log Failure Details') {
      when {
        expression { currentBuild.currentResult == 'FAILURE' }
      }
      steps {
        echo "📝 Parsing results.jtl for failed samples and dumping responseData…"
        script {
          // read the CSV into a list of maps
          def rows = readCSV file: 'results.jtl', skipFirstLine: false
          // the header row will include a "responseData" column
          rows.each { row ->
            if (row.success == 'false') {
              echo "----"
              echo "Label:    ${row.label}"
              echo "Code:     ${row.responseCode} ${row.responseMessage}"
              echo "URL:      ${row.URL}"
              echo "Response:"
              // multi-line log
              row.responseData.split("\\r?\\n").each { line ->
                echo "    ${line}"
              }
            }
          }
        }
      }
    }

    stage('Report JMeter Progress') {
      steps {
        script {
          def statsFile = "reports/jmeter-${env.BUILD_NUMBER}/statistics.json"
          if (fileExists(statsFile)) {
            def stats = readJSON file: statsFile
            def done  = stats.Total.sampleCount
            echo "✅ JMeter has completed ${done} iteration${done == 1 ? '' : 's'} so far."
          } else {
            echo "⚠️ No JMeter statistics.json found at ${statsFile}."
          }
        }
      }
    }

    // … your Jira / Docker stages go here, un-commented if you want them …

  }

  post {
    always {
      echo "📦 Archiving JMeter outputs…"
      archiveArtifacts artifacts: 'results.jtl, jmeter.log', fingerprint: true
    }
    success {
      echo "📊 Publishing JMeter HTML report…"
      publishHTML([
        reportDir:    "reports/jmeter-${env.BUILD_NUMBER}",
        reportFiles:  'index.html',
        reportName:   'JMeter HTML Report',
        keepAll:      true,
        alwaysLinkToLastBuild: true
      ])
    }
    failure {
      script {
        if (env.ISSUE_KEY) {
          echo "💥 Notifying Jira of failure…"
          jiraAddComment(
            site:      env.JIRA_SITE,
            idOrKey:   env.ISSUE_KEY,
            comment:   "⚠️ Build #${env.BUILD_NUMBER} FAILED: ${env.BUILD_URL}"
          )
        }
      }
    }
  }

}
