/**
 * *******************************************************
 * AOSPlus (Animate on scroll +) - 并不是 aos 的升级版
 * 基于animate.css，用于在两个方向上滚动动画元素
 * *******************************************************
 */
import 'animate.css'

let options = {
    offset: 0, // 距离底部距离触发
    delay: 0, // 延迟时间
    duration: 400, // 动画持续时间
    once: false, // 是否只执行一次动画
    attr: 'data-aos', // 动画元素属性
}
const init = ((settings) => {
    options = Object.assign(options, settings);
    // 检测浏览器是否支持 MutationObserver
    if (!window.MutationObserver) {
        console.info(`
          aosPlus: 本浏览器不支持MutationObserver.
          请更新浏览器更高版本.
        `);
        return;
    }
    if(document.body){
        observeElement();
    }else{
        window.addEventListener('DOMContentLoaded', () => {
            observeElement();
        })
    }
    
})
/**
 * 观察 dom节点变化
 */
const observeElement = () => {
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true, attributeFilter:[options.attr] };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config)
    observeInView();
}

/**
 * 观察 dom节点是否出现在可视区域内
 */
const observeInView = () => {  
    const elements = document.querySelectorAll(`[${options.attr}]`);
    if (elements.length === 0) {
        console.log('没有找到动画元素');
        return;
    }
    elements.forEach(element => {
        // 监听元素进入视口的事件
        const observer = new IntersectionObserver((entries, observer) => {  
        entries.forEach((entry) => {  
            if (entry.isIntersecting) {
                console.log('动画元素进入视口:', element);
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
    })
}

/**
 * 当观察到变动时执行的回调函数
 * @param {*} mutationsList 
 * @param {*} observer 
 */
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(addedNode => {  
                 // 判断节点是否为元素节点  
                if (addedNode.nodeType === 1) {  
                    // 检查元素是否有特定的data属性  
                    const aosDom = addedNode.querySelectorAll(`[${options.attr}]`) ;
                    const hasDataAos = addedNode.hasAttribute(options.attr);
                    if (aosDom.length > 0 || hasDataAos) {  
                        console.log('找到了一个包含data属性的元素:', addedNode);  
                        init()
                    }  
                }  
            });  
            
        }
    }
};

/**
 * 执行动画
 * @param {*} element 
 * @param {*} options 
 */
const animateElement = (element, options) => {
     // 添加动画类名来触发CSS动画  
     const animateName = element.getAttribute(options.attr);
     element.classList.add('animate__animated');  
     element.classList.add(`${animateName}`);
     if (!options.once) {  
        setTimeout(() => {
            element.classList.remove(`${animateName}`);
        }, options.duration + options.delay);
    }  
}
export default {
    init
}