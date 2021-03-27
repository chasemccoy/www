import React from 'react';
import Link from '../components/Link';
import Pre from '../components/Pre';
import Bookmark from '../components/Bookmark';
import Tweet from '../components/Tweet';

const components = {
	Callout: React.Fragment,
	Link,
	Wide: React.Fragment,
	Tweet: React.Fragment,
	Video: React.Fragment,
	Bookmark: Bookmark,
	pre: Pre
};

export default components;
