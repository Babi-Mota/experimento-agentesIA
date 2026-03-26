Feature: Exam Creation

Scenario: Create an exam with questions
  Given there are existing questions
  When I create an exam with those question IDs
  Then the exam should be created successfully

Scenario: Generate exam version
  Given an existing exam
  When I generate a new version
  Then the system should return shuffled questions and answer key