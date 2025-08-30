package com.lpgdepot.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidGasStateException extends RuntimeException {
    public InvalidGasStateException(String message) {
        super(message);
    }
}
