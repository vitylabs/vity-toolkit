/*
    VityToolKitSDKContext class provides a global context for storing SDK configuration.
    This singleton class maintains essential SDK settings like user's privateKey.
    It is used to store the user's privateKey in a global context so that it can be accessed by other modules without having to pass the configuration around.

    Warning: Can cause problems if there are multiple instances of the SDK running in the same process.
*/
class VityToolKitSDKContext {
    static privateKey?: string;
    static publicKey?: string;
}

export default VityToolKitSDKContext;



