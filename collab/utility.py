from . models import *

def validatePassword(passwd):
      
    SpecialSym =['$', '@', '#', '%']
    val = True
    msg = ''
      
    if len(passwd) < 6:
        msg = 'length should be at least 6'
        val = False
          
    if len(passwd) > 20:
        msg = 'length should be not be greater than 8'
        val = False
          
    if not any(char.isdigit() for char in passwd):
        msg = 'Password should have at least one numeral'
        val = False
          
    if not any(char.isupper() for char in passwd):
        msg = 'Password should have at least one uppercase letter'
        val = False
          
    if not any(char.islower() for char in passwd):
        msg = 'Password should have at least one lowercase letter'
        val = False
          
    if not any(char in SpecialSym for char in passwd):
        msg = 'Password should have at least one of the symbols $@#'
        val = False
    if val:
        return val

def validateUsername(username):
    user = Profile.objects.filter(username = username)
    if(user):
        return False
    
    return True

def mandatoryMissing(dictionary, mandatoryList):
    print(dictionary.keys())
    print(mandatoryList)
    for mandatory in mandatoryList:
        print(dictionary[mandatory])
        if mandatory not in dictionary.keys() or not dictionary[mandatory]:
            return False
    
    return True