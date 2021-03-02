import React, { useState } from "react";
import "./BotigaTabs.css";

export default function BotigaTabs({ tabs = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    function setActiveTab(index) {
        return function () {
            setActiveIndex(index);
        }
    }

    function renderTabs() {
        return (
            <div className="tab-list">
                {tabs.map(({ tabName }, index) => (
                    <div className={index === activeIndex ? "tab-item-active" : "tab-item-not-active"} onClick={setActiveTab(index)}>
                        {tabName}
                    </div>
                ))}
            </div>
        )
    }

    function renderTabViews() {
        return (
            <React.Fragment>
                {tabs.map(({ tabView }, index) => (
                    index === activeIndex ? tabView : null
                ))}
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {renderTabs()}
            {renderTabViews()}
        </React.Fragment>
    );
}


