# [0.7.0](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.6.1...v0.7.0) (2020-04-19)

### Features

* **ios** Add support different border-radii per corner

### Bug Fixes

* **ios** Fix transforms applied by parent-navigator (MaterialTopTabNavigator issue)

## [0.6.1](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.6.0...v0.6.1) (2020-03-30)

### Bug Fixes

* **android** Fix `onMeasureNode` layout position when content translated


# [0.6.0](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.6...v0.6.0-alpha0) (2020-03-29)

### Bug Fixes

* **js** Fix SharedElementProp type-definition (thanks @evanc)
* **ios** Fix element position when scene is translated
* **android** Fix element position when scene is translated
* **android** Fix clipping for translation transforms

## Improvements

* Updated internal tooling
* Added new `test-app` using TypeScript (wip)


## [0.5.6](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.5...v0.5.6) (2020-02-09)


### Bug Fixes

* **ios:** Fix old content/style used when starting a new transition before a previous transition has ended ([64d8597](https://github.com/IjzerenHein/react-native-shared-element/commit/64d8597057609b668eff1dbbd627426a24def82b))



## [0.5.5](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.4...v0.5.5) (2020-01-07)


### Bug Fixes

* **ios:** fixed exception when rendering an empty ([af63cc0](https://github.com/IjzerenHein/react-native-shared-element/commit/af63cc0f0db7ab763ec0500409b90495b0d45b75))



## [0.5.4](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.3...v0.5.4) (2020-01-07)


### Bug Fixes

* **ios:** fixed border/background anim on >= RN60 ([17ef283](https://github.com/IjzerenHein/react-native-shared-element/commit/17ef2836a81848296a885d8085dbbc57b01bed78))
* **ios:** fixed image stretching/detection on RN60 ([8571cc5](https://github.com/IjzerenHein/react-native-shared-element/commit/8571cc5e981f8254992e9331a475eedff5ad594f))
* **ios:** fixed several ios code warnings ([117abcd](https://github.com/IjzerenHein/react-native-shared-element/commit/117abcda1f8b3d24b642aa1f55aa989add4b9166))
* **ios:** fixed transition hickup when using borderWidth ([ca0628c](https://github.com/IjzerenHein/react-native-shared-element/commit/ca0628c8ee5d50385f3903574626f7ce31677104))



## [0.5.3](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.2...v0.5.3) (2019-12-07)


### Bug Fixes

* **android:** fixed FastImage/ImageBackground animation for borderWidth > 0 ([2f5c48d](https://github.com/IjzerenHein/react-native-shared-element/commit/2f5c48d87bbf474a48296a282446a10481ab24ef))



## [0.5.2](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.1...v0.5.2) (2019-11-13)


### Bug Fixes

* **ios:** fixed <ImageBackground> transitions on iOS with RN >= 0.60 ([5b6b856](https://github.com/IjzerenHein/react-native-shared-element/commit/5b6b856ccfae07b9f9bfa6c3a1030ce8aa5d4641))
* fixed crash with Animated.Image animated.Value transforms/opacity ([0ee7970](https://github.com/IjzerenHein/react-native-shared-element/commit/0ee7970c7b90ae6d2e89b80830fe3070d35b5067))
* **ios:** fixed image border-radius/opacity/stretch on RN >= 0.60 ([ad66f87](https://github.com/IjzerenHein/react-native-shared-element/commit/ad66f87dbde550fc3dfa2dda7b35075032138c2c))


### Features

* added flow-typings ([ab792c7](https://github.com/IjzerenHein/react-native-shared-element/commit/ab792c7bccf2c19294e74848b7b678889b8a004b))



## [0.5.1](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.5.0...v0.5.1) (2019-09-06)


## Improvements

* **android:** updated internal Package and ViewManager init so it's easier to integrate into Expo


# [0.5.0](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.4.3...v0.5.0) (2019-09-04)


### Bug Fixes

* **android:** disabled any transitions when element is fully clipped ([e02c700](https://github.com/IjzerenHein/react-native-shared-element/commit/e02c700))
* **android:** fixed internal style fetch when element was unmounted ([fd1a772](https://github.com/IjzerenHein/react-native-shared-element/commit/fd1a772))
* **android:** fixed pixel rounding in transitions ([a97acd9](https://github.com/IjzerenHein/react-native-shared-element/commit/a97acd9))
* **android:** fixed source-element sometimes briefly visible ([9785ae4](https://github.com/IjzerenHein/react-native-shared-element/commit/9785ae4))
* **android:** fixed support.v4 build error and RTL detection ([9c374e9](https://github.com/IjzerenHein/react-native-shared-element/commit/9c374e9))
* **android:** fixed text context sometimes not visible (clipped) ([d6e1445](https://github.com/IjzerenHein/react-native-shared-element/commit/d6e1445))
* **android:** fixed transition when element was scaled ([ee27709](https://github.com/IjzerenHein/react-native-shared-element/commit/ee27709))
* **android:** fixed transition when end-element was fetched first ([92a999c](https://github.com/IjzerenHein/react-native-shared-element/commit/92a999c))
* **android:** fixed transition when start element is fully clipped ([86f2810](https://github.com/IjzerenHein/react-native-shared-element/commit/86f2810))
* **ios:** fixed color interpolation when one was fully transparent ([f0d1dee](https://github.com/IjzerenHein/react-native-shared-element/commit/f0d1dee))


### Features

* added support for `fade-in` and `fade-out` animation types ([c2fd9b6](https://github.com/IjzerenHein/react-native-shared-element/commit/c2fd9b6))
* **android:** added support for `onMeasure` and `debug` props ([3039dff](https://github.com/IjzerenHein/react-native-shared-element/commit/3039dff))



## [0.4.3](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.4.2...v0.4.3) (2019-09-02)


### Bug Fixes

* **ios:** fixed homepage missing from podfile ([e1649bd](https://github.com/IjzerenHein/react-native-shared-element/commit/e1649bd))



## [0.4.2](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.4.1...v0.4.2) (2019-08-30)


### Bug Fixes

* fixed react-navigation demo due to API changes in the binding ([9204d39](https://github.com/IjzerenHein/react-native-shared-element/commit/9204d39))
* **android:** fixed transition not visible when app was too busy ([f7d5f56](https://github.com/IjzerenHein/react-native-shared-element/commit/f7d5f56))



## [0.4.1](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.4.0...v0.4.1) (2019-08-29)


### Bug Fixes

* **android:** fixed occasional incorrect view measure for FastImage ([ec32eb2](https://github.com/IjzerenHein/react-native-shared-element/commit/ec32eb2))



# [0.4.0](https://github.com/IjzerenHein/react-native-shared-element/compare/v0.3.0...v0.4.0) (2019-08-28)


### Initial release
