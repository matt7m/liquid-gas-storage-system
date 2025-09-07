package com.lpgdepot.backend.util;

public class DepotUtil {
    public static boolean checkLoadOperation(Long capacity, Long currentState, Long loaded){
        return currentState + loaded <= capacity;
    }

    public static boolean checkUnloadOperation(Long currentState, Long unloaded){
        return currentState - unloaded >= 0;
    }
}
