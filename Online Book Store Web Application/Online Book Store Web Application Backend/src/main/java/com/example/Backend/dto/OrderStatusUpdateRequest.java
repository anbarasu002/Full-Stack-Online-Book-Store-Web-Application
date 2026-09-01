package com.example.Backend.dto;

import com.example.Backend.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private OrderStatus status;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}