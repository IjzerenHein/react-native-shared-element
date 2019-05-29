
Pod::Spec.new do |s|
  s.name         = "RNVisualClone"
  s.version      = "1.0.0"
  s.summary      = "RNVisualClone"
  s.description  = <<-DESC
                  RNVisualClone
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/IjzerenHein/react-native-visua-clone.git", :tag => "master" }
  s.source_files  = "RNVisualClone/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  