require 'json'

Pod::Spec.new do |s|

  # NPM package specification
  package = JSON.parse(File.read(File.join(File.dirname(__FILE__), "package.json")))

  s.name         = "RNSharedElement"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "9.0" }

  s.source       = { :git => "https://github.com/IjzerenHein/react-native-shared-element.git", :tag => "v#{s.version}" }
  s.source_files = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency 'React-Core'
end
