using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Visual.Clone.RNVisualClone
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNVisualCloneModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNVisualCloneModule"/>.
        /// </summary>
        internal RNVisualCloneModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNVisualClone";
            }
        }
    }
}
