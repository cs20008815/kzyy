package org.clj.crmproj.util;

/**
 * Created by Administrator on 2017/2/9.
 */
public class Response {

    private String status = "S";
    private String message;
    private Object output;

    public Response() {
    }

    public Response(String message) {
        this.setStatus("E");
        this.setMessage(message);
    }

    public Response(String status, String message) {
        this.setStatus(status);
        this.setMessage(message);
    }

    public Response(Object output) {
        this.setOutput(output);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getOutput() {
        return output;
    }

    public void setOutput(Object output) {
        this.output = output;
    }

}
