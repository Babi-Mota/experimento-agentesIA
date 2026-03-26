Feature: Question Management

Scenario: Create a valid question
  Given I have a question with at least 2 alternatives
  When I create the question
  Then the question should be stored successfully

Scenario: Fail to create invalid question
  Given I have a question with less than 2 alternatives
  When I try to create the question
  Then the system should return an error