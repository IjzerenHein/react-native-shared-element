
Pod::Spec.new do |s|
  s.name         = "RNSharedElementTransition"
  s.version      = "1.0.0"
  s.summary      = "RNSharedElementTransition"
  s.description  = <<-DESC
                  RNSharedElementTransition
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/IjzerenHein/react-native-shared-element-transition.git", :tag => "master" }
  s.source_files  = "RNSharedElementTransition/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  