import time
from functools import wraps

class RateLimit:
    def __init__(self, limitNum=0, limitRange=0):
        self.limitNum = limitNum
        self.limitRange = limitRange
        self.requests = []
    
    def checkLimit(self):
        valid = True
        if (self.limitNum > 0 and self.limitRange>0):
            valid = False
            current = time.time()
            print(self.requests)
            while ((len(self.requests)>0) and (current - self.requests[0] > self.limitRange)):
                self.requests.pop(0)
            if (len(self.requests) < self.limitNum):
                valid = True
                self.requests.append(current)
        return valid