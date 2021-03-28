import React from 'react';
import Link from '../components/Link';
import Pre from '../components/Pre';
import Bookmark from '../components/Bookmark';
import Video from '../components/Video';

const components = {
	Callout: React.Fragment,
	Link,
	Wide: React.Fragment,
	Video: Video,
	Bookmark: Bookmark,
	pre: Pre
};

export default components;
