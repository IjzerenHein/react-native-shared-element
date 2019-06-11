using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Visual.Clone.RNSharedElement
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNSharedElementModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNSharedElementModule"/>.
        /// </summary>
        internal RNSharedElementModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNSharedElement";
            }
        }
    }
}
