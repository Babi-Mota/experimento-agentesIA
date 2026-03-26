Feature: Report Generation

Scenario: Generate class report with correct answers
  Given an exam with 2 questions
  And an answer key
  And a student submission with correct answers
  When I generate the class report
  Then the student score should be maximum

Scenario: Generate report with incorrect answers
  Given an exam with 2 questions
  And an answer key
  And a student submission with incorrect answers
  When I generate the class report
  Then the score should be lower