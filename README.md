Angular Hint: Interpolation [![Build Status](https://travis-ci.org/angular/angular-hint-interpolation.svg)](https://travis-ci.org/angular/angular-hint-interpolation)
==================

Angular Hint Interpolation lets you spend less time finding silent errors in your code and more time on actually programming. This tool is a subset of many under the [Angular Hint](https://github.com/angular/angular-hint) repository that specializes in identifying errors relating to interpolations. For instructions on how to incorporate the whole Angular Hint repository into your project, please refer to the link above.

Angular Hint Interpolation notifies you of any interpolation that evaluates to undefined. In the code below, if the interpolation in the source of the image was undefined, we would would end up with 'imgs/users/.png'. With Hint Interpolation one would immediately know that the interpolation was undefined and wouldn't have to wonder as to why their image wasn't displaying.

```
<img ng-src='imgs/users/{{user.name}}.png'/>
```

Additionally, Hint Interpolation addresses the problem of identifying where in chain the object becomes undefined when evaluating values deep within nested object. For example, imagine the scenario below where you have a chain of values from an api and you need to get to the url of a tweet. If any of the values in the chain do not exsist because of a typo, index out of bounds, etc. you would get an empty string returned and you wouldn't know where your code went awry. Hint Interpolation would notify you that 'data.results[0].url' was found to be undefined in the interpolation 'data.results[0].url[0].url'.
```
<a ngHref = '{{data.results[0].url[0].url'>Link to Tweet</a>
```
```
data = {
  "completed_in":0.031,
  "refresh_url":"?since_id=122078461840982016&q=blue%20angels",
  "results":[
    {
      "entities":{
        "urls":[
          {
            "url":"http://t.co/L9JXJ2ee",
            "expanded_url":"http://bit.ly/q9fyz9",
            "display_url":"bit.ly/q9fyz9",
            "indices":[
              37,
              57
            ]
          }
        ]
      }
    }]
}
```

----

## [License](LICENSE)

Copyright 2014 Google, Inc. http://angularjs.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
