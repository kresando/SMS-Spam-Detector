"""
Text Preprocessing Module for Indonesian SMS
Handles: lowercase, special char removal, tokenization, stopword removal, stemming
"""

import re
import string
from typing import List

from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory


class TextPreprocessor:
    """Preprocessor for Indonesian text with stemming and stopword removal."""
    
    def __init__(self):
        # Initialize Sastrawi stemmer
        stemmer_factory = StemmerFactory()
        self.stemmer = stemmer_factory.create_stemmer()
        
        # Initialize Sastrawi stopword remover
        stopword_factory = StopWordRemoverFactory()
        self.stopword_remover = stopword_factory.create_stop_word_remover()
        
        # Additional custom stopwords for SMS
        self.custom_stopwords = {
            'yg', 'dgn', 'utk', 'dg', 'dr', 'ke', 'di', 'pd', 'sdh', 'blm',
            'tdk', 'ga', 'gak', 'gk', 'kpd', 'kl', 'klo', 'krn', 'krna',
            'bs', 'bisa', 'jg', 'juga', 'sm', 'sama', 'aja', 'saja',
            'dll', 'dst', 'dsb', 'dkk', 'etc', 'hub', 'info', 'cs',
            'rp', 'rb', 'ribu', 'jt', 'juta', 'gb', 'mb', 'kb'
        }
    
    def clean_text(self, text: str) -> str:
        """Remove special characters, numbers, and normalize text."""
        if not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\.\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'\+?\d{10,}', '', text)
        text = re.sub(r'\*\d+#', '', text)  # USSD codes like *123#
        
        # Remove special characters and numbers
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\d+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def remove_stopwords(self, text: str) -> str:
        """Remove Indonesian stopwords using Sastrawi + custom stopwords."""
        # Use Sastrawi stopword remover
        text = self.stopword_remover.remove(text)
        
        # Remove custom stopwords
        words = text.split()
        words = [w for w in words if w not in self.custom_stopwords]
        
        return ' '.join(words)
    
    def stem_text(self, text: str) -> str:
        """Apply Indonesian stemming using Sastrawi."""
        return self.stemmer.stem(text)
    
    def preprocess(self, text: str) -> str:
        """Full preprocessing pipeline."""
        # Step 1: Clean text
        text = self.clean_text(text)
        
        # Step 2: Remove stopwords
        text = self.remove_stopwords(text)
        
        # Step 3: Stemming
        text = self.stem_text(text)
        
        return text
    
    def preprocess_batch(self, texts: List[str]) -> List[str]:
        """Preprocess multiple texts."""
        return [self.preprocess(text) for text in texts]


# Singleton instance for reuse
_preprocessor = None

def get_preprocessor() -> TextPreprocessor:
    """Get or create singleton preprocessor instance."""
    global _preprocessor
    if _preprocessor is None:
        _preprocessor = TextPreprocessor()
    return _preprocessor


def preprocess_text(text: str) -> str:
    """Convenience function for preprocessing single text."""
    return get_preprocessor().preprocess(text)
