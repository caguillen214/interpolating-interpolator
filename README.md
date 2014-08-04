# Angular Hint Interpolation [![Build Status](https://travis-ci.org/angular/angular-hint-interpolation.svg)](https://travis-ci.org/angular/angular-hint-interpolation) [![Code Climate](https://codeclimate.com/github/angular/angular-hint-interpolation.png)](https://codeclimate.com/github/angular/angular-hint-interpolation)

This hinting module is part of the overall tool [AngularHint](https://github.com/angular/angular-hint)
that aims to help you spend less time finding silent errors in your code and more time programming. Loading this module will provide warnings specific to AngularJS interpolation.

See the [AngularHintInterpolation NPM Module](https://www.npmjs.org/package/angular-hint-interpolation).

##Usage

Install the [AngularHint NPM module](https://www.npmjs.org/package/angular-hint)
and use `ng-hint` or `ng-hint-include='interpolation'` to
enable AngularHintInterpolation. Further installation information is available on the
[main AngularHint repository](https://github.com/angular/angular-hint#usage).


##Features
  - [Notifies of undefined parts of interpolation chains](#undefined-parts-warning)
  - [Suggests closest variable to the first undefined variable in chain](#variable-suggestion)


####<a name="undefined-parts-warning"></a> Undefined Parts Warning
 AngularHintInterpolation addresses the problem of identifying where (within a chain) objects become undefined. For example, in the code below one would be notified that `data.results[0].urls` was found to be `undefined` in the interpolation `data.results[0].entities.urls.main_url`.

```html
//html implementation
<a ng-href="{{data.results[0].urls.main_url}}">Link to Post</a>
```

```javascript
//controller implementation
$scope.data = {
  "completed_in": 0.031,
  "refresh_url": "?sinceid=122078461840982016&q=blue%20angels",
  "results": [
    {
      "entities":{
        "urls": {
          "condensed_url": "http://t.co/L9JXJ2ee",
          "main_url": "http://t.co/imgs/users/venrov/L9JXJ2ee"
        }
      }
    }]
}
```

####<a name="variable-suggestion"></a> Variable Suggestion
 If your value that evaluates to `undefined` is close enough to an actual value present on the scope, AngularHintInterpolation will suggest an alternative value. Using the HTML code below, you would be notified that `data.results[0].entity` was undefined but that you should try `entities`.

```html
//html implementation
<a ng-href="{{data.results[0].entity.urls.main_url}}">Link to Post</a>
```

```javascript
//controller implementation
$scope.data = {
  "completed_in": 0.031,
  "refresh_url": "?sinceid=122078461840982016&q=blue%20angels",
  "results": [
    {
      "entities":{
        "urls": {
          "condensed_url": "http://t.co/L9JXJ2ee",
          "main_url": "http://t.co/imgs/users/venrov/L9JXJ2ee"
        }
      }
    }]
}
```

##Contributing

Want to improve AngularHintInterpolation or other facets of AngularHint? We'd love to get your help! See the [Contributing Guidelines](https://github.com/angular/angular-hint/blob/master/CONTRIBUTING.md).

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
