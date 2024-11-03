import {  Fragment, Children, cloneElement, isValidElement } from "react";

const Skeleton = {
  Frame({ width, height, className }) {
    return (
      <div
        className={`animate-pulse bg-[--cms-bg_hover] rounded ${className}`}
        style={{ width, height }}
      />
    );
  },
  Text({ children, className }) {
    return (
      <span className={` bg-[--cms-bg_hover] rounded ${className}`}>
        {/* {children} */}
        {/* //random length text 5-20 */}
        {Array.from({ length: Math.floor(Math.random() * 35) + 5 }, (_, index) => (
          // <span key={index}>&nbsp;</span>
          <span className=" text-transparent" key={index}>X</span>
        ))}
      </span>
    );
  },
  Wrapper({ isLoading, children }) {
    if (!isLoading) return children;

    const createSkeleton = (element) => {
      // Handle string (text) nodes
      if (typeof element === 'string') {
        return <Skeleton.Text>{element}</Skeleton.Text>;
      }

      // Handle non-object or null elements
      if (typeof element !== 'object' || element === null) {
        return <Skeleton.Frame width="100%" height="1em" />;
      }

      // Handle arrays
      if (Array.isArray(element)) {
        return element.map((child, index) => (
          <Fragment key={index}>
            {createSkeleton(child)}
          </Fragment>
        ));
      }

      // Handle React elements
      if (isValidElement(element)) {
        // If the element has children, recursively create skeletons for them
        if (element.props && element.props.children) {
          const childrenArray = Children.toArray(element.props.children);
          const skeletonChildren = childrenArray.map((child, index) => (
            <Fragment key={index}>
              {createSkeleton(child)}
            </Fragment>
          ));

          // Clone the element with skeleton children
          return cloneElement(
            element,
            { ...element.props, className: `${element.props.className || ''} animate-pulse` },
            ...skeletonChildren
          );
        }

        // If it's a leaf node with no children, return a frame or text skeleton
        return element.type === 'img'
          ? <Skeleton.Frame width="100%" height={element.props?.height || "1em"} className={element.props?.className} />
          : <Skeleton.Text className={element.props?.className}>{'\u00A0'}</Skeleton.Text>;
      }

      // Default case: return a frame
      return <Skeleton.Frame width="100%" height="1em" />;
    };

    return <>{createSkeleton(children)}</>;
  }
};

export default Skeleton;