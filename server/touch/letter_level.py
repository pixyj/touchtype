from letters_by_level import LEVEL_LETTERS

def get_letter_levels():
	level_letters = LEVEL_LETTERS.split('\n')	
	level_dict = {}
	
	for line in level_letters:
		line = line.strip()	
		letter,level = line.split(';')
		level_dict[letter] = level	
	return level_dict
	
if __name__ == "__main__":
	print get_letter_levels()
