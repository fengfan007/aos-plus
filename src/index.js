import 'animate.css';
/**
 * Represents a book.
 * @constructor
 */
const aos = () => {
    console.log('进来了');
    const options = {
        offset: 0, // 距离底部距离触发
        delay: 0, // 延迟时间
        duration: 400, // 动画持续时间
        once: false, // 是否只执行一次动画
    }
    // 获取所有需要动画的元素  
    const elements = document.querySelectorAll('[data-aos]');
    if(elements){
        elements.forEach((element) => {  
            // 监听元素进入视口的事件
            const observer = new IntersectionObserver((entries, observer) => {  
              entries.forEach((entry) => {  
                if (entry.isIntersecting) {
                    animateElement(element, options)
                        
                    // 如果只执行一次动画，则停止观察  
                    if (options.once) {  
                        observer.unobserve(element);  
                    }  
                } 
              });  
            }, {  
              root: null,  
              rootMargin: `${options.offset}px 0px`,  
              threshold: 0.1, // 触发动画的阈值  
            });  
            observer.observe(element);  
      });  
    }
    
}
function animateElement(element, options) {  
     // 添加动画类名来触发CSS动画  
     const animateName = element.getAttribute('data-aos');
     element.classList.add('animate__animated');  
     element.classList.add(`${animateName}`);
     if (!options.once) {  
        setTimeout(() => {
            element.classList.remove(`${animateName}`);
        }, 1000);
    }  
}
// 目标节点
const targetNode = document.querySelector('body');
 
// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true, attributeFilter:["data-aos"] };
 
// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(addedNode => {  
                 // 判断节点是否为元素节点  
                if (addedNode.nodeType === 1) {  
                    // 检查元素是否有特定的data属性  
                    const aosDom = addedNode.querySelectorAll('[data-aos]')
                    if (aosDom.length>0) {  
                        console.log('找到了一个包含data属性的元素:', addedNode);  
                        // 如果你只需要找到第一个这样的元素，可以取消观察  
                        aos();
                        // observer.disconnect();
                    }  
                }  
            });  
            
        }
        else if (mutation.type === 'attributeFilter') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};
 
// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);
 
// 开始观察目标节点
observer.observe(targetNode, config);
 
// 以后，你可以停止观察
// observer.disconnect();
