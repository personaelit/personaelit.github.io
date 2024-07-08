from datetime import datetime

def time_to_rgb(timestamp):
    # Extract hour, minute, and second from the timestamp
    hour = timestamp.hour
    minute = timestamp.minute
    second = timestamp.second
    
    # Normalize values to 0-255 range
    red = int((hour / 23) * 255)   # Hours range from 0-23
    green = int((minute / 59) * 255)  # Minutes range from 0-59
    blue = int((second / 59) * 255)  # Seconds range from 0-59
    
    return (red, green, blue)

# Example usage
timestamp = datetime.now()  # Current time
rgb = time_to_rgb(timestamp)
print(f"Timestamp: {timestamp}")
print(f"RGB: {rgb}")
