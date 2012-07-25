from word_list import WORD_LIST

def sort_words(level_dict):
	""" Sorts words by level given by level_dict"""
	sorted_words = [ [] for i in xrange(24) ]
	
	words = WORD_LIST.split('\n')
	
	for word in words:
		word = word.strip()
		max_level = 0
		for letter in word:
			try:
				level = int(level_dict[letter])
				if level > max_level:
					max_level = level
			except:
				pass
		sorted_words[max_level].append(word)
		
	return sorted_words
	
